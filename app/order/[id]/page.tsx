import type { Metadata } from "next";
import OrderDetails from "@/components/OrderDetails";

export const metadata: Metadata = { title: "Order confirmation" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <OrderDetails id={id} />
    </div>
  );
}
