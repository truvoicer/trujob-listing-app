import { isObject } from "@/helpers/utils";
import { ProductHealthCheck } from "@/types/Product";

export type ProductHealthCheckDisplayProps = {
  data: ProductHealthCheck;
};
function ProductHealthCheckDisplay({ data }: ProductHealthCheckDisplayProps) {
  return (
    <div>
      <h3>Product Health Check</h3>
      <p>Unhealthy Products: {data.unhealthy.count}</p>
      <ul>
        {isObject(data?.unhealthy?.items) &&
          Object.keys(data.unhealthy.items).map((key: string, index: number) => (
            <li key={index}>{data.unhealthy.items[key].message}</li>
          ))}
      </ul>
      <p>Healthy Products: {data.healthy.count}</p>
      <ul>
        {isObject(data?.healthy?.items) &&
          Object.keys(data.healthy.items).map((key: string, index: number) => (
            <li key={index}>{data.healthy.items[key].message}</li>
          ))}
      </ul>
    </div>
  );
}

export default ProductHealthCheckDisplay;
