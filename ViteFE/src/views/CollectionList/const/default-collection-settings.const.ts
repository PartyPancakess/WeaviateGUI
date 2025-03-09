export const DefaultCollectionSettings = [
  {
    class: "TestWithNoVector",
    invertedIndexConfig: {
      indexTimestamps: true,
    },
    multiTenancyConfig: {
      autoTenantActivation: true,
      autoTenantCreation: false,
      enabled: true,
    },
    properties: [
      {
        dataType: ["text"],
        description: "example property",
        indexFilterable: false,
        indexRangeFilters: false,
        indexSearchable: true,
        moduleConfig: {
          none: {
            skip: true,
            vectorizePropertyName: false,
          },
        },
        name: "myproperty",
        tokenization: "word",
      },
    ],
    vectorizer: "none",
  },
  {
    class: "TestWithVectorizer",
    invertedIndexConfig: {
      indexTimestamps: true,
    },
    multiTenancyConfig: {
      autoTenantActivation: true,
      autoTenantCreation: false,
      enabled: true,
    },
    properties: [
      {
        dataType: ["text"],
        description: "example property",
        indexFilterable: false,
        indexRangeFilters: false,
        indexSearchable: true,
        moduleConfig: {
          none: {
            skip: true,
            vectorizePropertyName: false,
          },
        },
        name: "myproperty",
        tokenization: "word",
      },
    ],
  },
];
