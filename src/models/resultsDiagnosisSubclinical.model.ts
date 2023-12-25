export type ResultsDiagnosisSubclinical = {
  id?: string;
  exam_card_details_id: string;
  subclinical_id: number;

  rate: string;
  results: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;

  images?: any[] | ResultsImage[];
  removeImages?: { id: string }[];
};

export type ResultsImage = {
  id?: string;
  result_id: string;
  url: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
};
