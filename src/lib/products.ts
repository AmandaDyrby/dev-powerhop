// Product shape returned by the Supabase products table.
export type Product = {
  id: number;
  modelname: string;
  active: boolean;
  usablepower: number | null;
  surgeprotection: number | null;
  chargingtime: number | null;
  acinputmin: number | null;
  acinputmax: number | null;
  battery: string | null;
  lifespan: number | null;
  inverter: number | null;
  extratraits: string | null;
  price: number | null;
  productdescription: string | null;
  productblurb: string | null;
  specs: string | null;
  "feature-lights": boolean | null;
  "feature-fan": boolean | null;
  "feature-wifi": boolean | null;
  "feature-laptop": boolean | null;
  "feature-tv": boolean | null;
  "feature-phone": boolean | null;
  "feature-sewing": boolean | null;
  "feature-pos": boolean | null;
  "feature-drill": boolean | null;
  "feature-fridge": boolean | null;
  "feature-aircon": boolean | null;
  "feature-freezer": boolean | null;
  "feature-speaker": boolean | null;
  "feature-printer": boolean | null;
  "feature-computer": boolean | null;
  imgfront: string | null;
  imgface: string | null;
  imgback: string | null;
};

// Environment variables required to connect to Supabase.
const requiredEnv = {
  SUPABASE_URL: import.meta.env.SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY: import.meta.env.SUPABASE_PUBLISHABLE_KEY,
};

// Validate Supabase config before building the request URL and auth key.
function getSupabaseConfig() {
  // Collect missing values so the error message can name every missing variable.
  const missing = Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(
        ", ",
      )}. Add them in Netlify under Site configuration > Environment variables, then redeploy.`,
    );
  }

  // Point the request at the products REST endpoint.
  return {
    url: new URL("/rest/v1/products", requiredEnv.SUPABASE_URL),
    key: requiredEnv.SUPABASE_PUBLISHABLE_KEY,
  };
}

// Fetch all active products, ordered by id, with an optional Supabase select list.
export async function fetchActiveProducts(select = "*") {
  const { url, key } = getSupabaseConfig();

  // Add Supabase query parameters for fields, active status, and display order.
  url.searchParams.set("select", select);
  url.searchParams.set("active", "eq.true");
  url.searchParams.set("order", "id.asc");

  const response = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  // Fail the build/request if Supabase returns an error.
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  // Return the response as typed product data for pages and components.
  return (await response.json()) as Product[];
}
