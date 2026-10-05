export interface OpenFdaData {
  brand_name?: string[];
  generic_name?: string[];
  manufacturer_name?: string[];
  product_type?: string[];
  route?: string[];
  substance_name?: string[];
  pharm_class_cs?: string[];
  pharm_class_epc?: string[];
  rxcui?: string[];
  package_ndc?: string[];
  spl_id?: string[];
}

export interface DrugLabelResult {
  id: string;
  openfda?: OpenFdaData;
  purpose?: string[];
  indications_and_usage?: string[];
  warnings?: string[];
  dosage_and_administration?: string[];
  active_ingredient?: string[];
  inactive_ingredient?: string[];
  storage_and_handling?: string[];
}

export interface FdaApiResponse {
  results?: DrugLabelResult[];
  error?: {
    code: string;
    message: string;
  };
}