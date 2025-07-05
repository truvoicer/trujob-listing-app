import { ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import Image from "next/image";
import Link from "next/link";

export type ErrorViewProps = {
  errors: ErrorItem[];
};
function ErrorView({ errors }: ErrorViewProps) {
  return (
    <div className="container">
      <div className="row no-gutters height-self-center">
        <div className="col-sm-12 text-center align-self-center">
          <div className="iq-error position-relative">
            <Image
              src="/images/error/500.png"
              width={500}
              height={500}
              className="img-fluid iq-error-img"
              alt="error-img"
            />
            <h2 className="mb-0">Oops! This Page is Not Working.</h2>
            <div className="mt-3">
            {Array.isArray(errors) && errors.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
            </div>
            <Link
              className="btn btn-primary d-inline-flex align-items-center mt-3"
              href="/"
            >
              <i className="ri-home-4-line"></i>Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorView;
