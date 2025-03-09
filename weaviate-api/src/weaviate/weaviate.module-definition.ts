import { ConfigurableModuleBuilder } from "@nestjs/common";
import { WeaviateOptions } from "@/weaviate/weaviate.options";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<WeaviateOptions>()
  .setExtras<{ isGlobal?: boolean }>({ isGlobal: true }, (definition, extras) => {
    return { ...definition, global: extras.isGlobal };
  })
  .setClassMethodName('forRoot')
  .build();
