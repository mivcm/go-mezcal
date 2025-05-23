import OrderDetailClient from "./_components/OrderDetailClient";

type Params = { params: { id: string } };

export default function OrderPage({ params }: Params) {
  return <OrderDetailClient id={params.id} />;
}

export async function generateStaticParams() {
  return [{ id: "success" }]; // incluir "success" como un valor posible
}

export const dynamicParams = true;

