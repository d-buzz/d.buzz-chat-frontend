import Base58 from 'bs58';

function base58Encode(text) {
    return Base58.encode(stlib.Utils.Buffer().from(text, 'utf8'));
}
export function imageProxy(url) {
  if(url.endsWith(".gif")) 
    return "https://chat-api.peakd.com/gif?path="+encodeURIComponent(url);
  return "https://images.hive.blog/p/"+base58Encode(url)+'?width=768&height=0';
} 

