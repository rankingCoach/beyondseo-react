export interface LinkAssistant {
  id: string;
  post_id: string;
  source_uri: string;
  url: string;
  url_hash: string;
  hostname: string;
  hostname_hash: string;
  link_text: string;
  link_status_id: string;
  status: string;
  scan_date: string;
  created_at: string;
  updated_at: string;
}

export interface LinkAssistants {
  inbound: LinkAssistant[];
  outbound: LinkAssistant[];
  external: LinkAssistant[];
}
