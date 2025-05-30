export type IMarker = {
  id: number;
  latitude: number;
  longitude: number;
  title: string; 
  created_at: string;
};

export interface MarkerImage {
  id: number;               
  marker_id: number;         
  uri: string;               
  created_at: string;        
}
