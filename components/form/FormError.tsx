export type FormErrorProps = {

}

function FormError({ message }: FormErrorProps) {
  return (
    <div className="form-error">
      {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
          </div>
        )}
    </div>
  );
}

export default FormError;
