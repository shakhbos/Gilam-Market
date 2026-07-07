
 export const getDetailedDeviceName = () => {
    const ua = navigator.userAgent;
  
    const match = ua.match(/\(([^)]+)\)/);
    if (!match) return "Unknown device";
  
    return match[1]; 
  };
  
  export const minio_img_url = "https://s3.gilam-market.uz";
