export const formatDate = (dateString: any) => {
  if(!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

export const formatDuration = (duration: any) => {
  if(!duration) return '';

  const pad = (num: any) => num.toString().padStart(2, '0');

  if(typeof duration === 'string' && duration.includes(':')) {
    const parts = duration.split(":").map((val) => parseInt(val, 10) || 0);

    if (parts.length === 3) {
      const [h, m, s] = parts;

      if(h > 0) {
        return `${h} hrs ${pad(m)} min`;
      }
      else {
        return `${pad(m)} min ${pad(s)} sec`;
      }
    } 
    
    if (parts.length === 2) {
      // Format is MM:SS -> Return "00m 00s"
      const [m, s] = parts;
      return `${pad(m)} min ${pad(s)} sec`;
    }
  }

  const totalSeconds = parseInt(duration, 10) || 0;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h} hrs ${pad(m)} min`;
  }
  return `${pad(m)} min ${pad(s)} sec`;
}

export const formatProgress = (duration: any) => {
  if(!duration || isNaN(duration)) return "00:00";

  const pad = (num: any) => num.toString().padStart(2, "0");

  let totalSeconds = 0;

  if(typeof duration === 'string' && duration.includes(':')) {
    const parts = duration.split(":").map(Number);

    if(parts.length === 3) {
      totalSeconds = parts[0] * 3600 + parts[1] + 60 + parts[2];

    } else if(parts.length === 2) {
      totalSeconds = parts[0] * 60 + parts[1];
    }

  } else {
    totalSeconds = parseInt(duration, 10);
  }

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor((totalSeconds % 60));

  if(h > 0) {
    return `${pad(h)}:${pad(m)}:${s}`;
  }

  return `${pad(m)}:${pad(s)}`;
}