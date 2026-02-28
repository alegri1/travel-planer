const BASE = "https://test.api.amadeus.com";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID!,
      client_secret: process.env.AMADEUS_CLIENT_SECRET!,
    }),
  });

  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.value;
}

export interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  currency: string;
  cabin: string;
  stops: number;
}

function parseDuration(iso: string): string {
  const h = iso.match(/(\d+)H/)?.[1];
  const m = iso.match(/(\d+)M/)?.[1];
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ") || iso;
}

export async function searchFlights(
  origin: string,
  destination: string,
  date: string,
  adults: number = 1
): Promise<FlightOffer[]> {
  const token = await getToken();

  const params = new URLSearchParams({
    originLocationCode: origin.toUpperCase(),
    destinationLocationCode: destination.toUpperCase(),
    departureDate: date,
    adults: String(adults),
    max: "10",
    currencyCode: "USD",
  });

  const res = await fetch(`${BASE}/v2/shopping/flight-offers?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err?.errors?.[0]?.detail as string | undefined) ??
        `Amadeus search failed: ${res.status}`
    );
  }

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.data ?? []).map((offer: any): FlightOffer => {
    const segs = offer.itineraries[0].segments;
    const first = segs[0];
    const last = segs[segs.length - 1];

    return {
      id: offer.id,
      airline: first.carrierCode,
      flightNumber: `${first.carrierCode}${first.number}`,
      origin: first.departure.iataCode,
      destination: last.arrival.iataCode,
      departure: first.departure.at,
      arrival: last.arrival.at,
      duration: parseDuration(offer.itineraries[0].duration),
      price: offer.price.total,
      currency: offer.price.currency,
      cabin:
        offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ??
        "ECONOMY",
      stops: segs.length - 1,
    };
  });
}
