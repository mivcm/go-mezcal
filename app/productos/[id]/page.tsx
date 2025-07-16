"use client"
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";

const ProductClient = dynamic(() => import("./_components/ProductClient"), { ssr: false });

type PageProps = {
  params: {
    id: string;
  };
};


export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/api/v1/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);
  if (!product) return <div>Loading...</div>;
  return <ProductClient product={product} />;
}
