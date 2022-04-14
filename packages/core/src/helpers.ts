export const dashed = (camel: string) => camel.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
export const dashedKeys = (o: any) => Object.fromEntries(Object.entries(o).map(([k, v]) => [dashed(k), v]));
