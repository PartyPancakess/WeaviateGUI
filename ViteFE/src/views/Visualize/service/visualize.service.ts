import { PCA } from "ml-pca";
import { UMAP } from "umap-js";
import * as d3 from "d3";
import { useHTTPService } from "@/services/http.service";
import { kmeans } from "ml-kmeans";

function silhouetteScore(
  data: number[][],
  clusters: number[],
  centroids: number[][]
): number {
  const distances = (a: number[], b: number[]) =>
    Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));

  const clusterDistances = data.map((point, i) => {
    const cluster = clusters[i];
    const intraClusterDistances = data
      .filter((_, j) => clusters[j] === cluster && i !== j)
      .map((otherPoint) => distances(point, otherPoint));
    const a =
      intraClusterDistances.length > 0
        ? intraClusterDistances.reduce((sum, d) => sum + d, 0) /
          intraClusterDistances.length
        : 0;

    const interClusterDistances = centroids
      .filter((_, j) => j !== cluster)
      .map((centroid) => distances(point, centroid));
    const b = Math.min(...interClusterDistances);

    return (b - a) / Math.max(a, b);
  });

  return (
    clusterDistances.reduce((sum, s) => sum + s, 0) / clusterDistances.length
  );
}

export class VisualizeService {
  constructor(private readonly httpService = useHTTPService()) {}

  async createVisuals(
    method: "PCA" | "UMAP",
    chart: HTMLDivElement | null,
    vectorList: number[][]
  ): Promise<any> {
    const width = 900;
    const height = 600;
    const margin = 40;

    const data: number[][] = vectorList;

    if (chart) {
      d3.select(chart).selectAll("*").remove();
    }

    let reducedData: number[][] = [];

    // Perform dimensionality reduction based on the chosen method
    if (method === "PCA") {
      const pca = new PCA(data);
      // Reduce data to 2 dimensions
      reducedData = pca.predict(data, { nComponents: 2 }).to2DArray();
    } else if (method === "UMAP") {
      const umap = new UMAP();
      // Fit the model and retrieve a 2D embedding
      reducedData = umap.fit(data);
    }

    // Create an SVG element within the chart container
    const svg = d3
      .select(chart)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Calculate the extent of the reduced data for scaling
    const xExtent = d3.extent(reducedData, (d) => d[0]) as [number, number];
    const yExtent = d3.extent(reducedData, (d) => d[1]) as [number, number];

    // Create scales mapping data coordinates to SVG coordinates
    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([margin, width - margin]);
    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([height - margin, margin]);

    let optimalClusters = 1;
    let bestScore = -1;

    for (let k = 2; k <= 10; k++) {
      const { clusters, centroids } = kmeans(reducedData, k, {});
      const score = silhouetteScore(reducedData, clusters, centroids);

      if (score > bestScore) {
        bestScore = score;
        optimalClusters = k;
      }
    }

    const { clusters } = kmeans(reducedData, optimalClusters, {});

    // Create a color scale for the clusters
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .selectAll("circle")
      .data(reducedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 5)
      .attr("fill", (_d, i) => colorScale(`${clusters[i]}`));
  }

  async getCollectionNames(): Promise<string[]> {
    const response = await this.httpService.get("weaviate/collection-list");
    return response.data;
  }

  async getTenantNames(collectionName: string): Promise<string[] | undefined> {
    const response = await this.httpService.get(
      `weaviate/collection/${collectionName}/tenant-list`
    );
    return response.data.map((tenant: any) => tenant.name);
  }
}

export function useVisualizeService() {
  return new VisualizeService();
}
