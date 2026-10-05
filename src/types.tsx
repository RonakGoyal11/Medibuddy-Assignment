export interface OpenFdaData {
  brand_name?: string[];
  generic_name?: string[];
  manufacturer_name?: string[];
  product_type?: string[];
  route?: string[];
}

export interface DrugLabelResult {
  id: string;
  openfda?: OpenFdaData;
  purpose?: string[];
  indications_and_usage?: string[];
  warnings?: string[];
}

export interface FdaApiResponse {
  results?: DrugLabelResult[];
  error?: {
    code: string;
    message: string;
  };
}