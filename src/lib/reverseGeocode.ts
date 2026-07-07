export async function reverseGeocode(lat, lng) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );
  
    if (!res.ok) throw new Error("Failed to fetch address");
  
    const data = await res.json();
  
    return data.display_name ;
  }
  