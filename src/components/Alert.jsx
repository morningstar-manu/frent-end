import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { alertActions } from "../_store";
import { Alert } from "flowbite-react";


export default function DefaultAlert() {
  const dispatch = useDispatch();
  const location = useLocation();
  const alert = useSelector((state) => state.alert.value);

  useEffect(() => {
    dispatch(alertActions.clear());
  }, [dispatch, location]);

  if (!alert) return null;
  return (
    <Alert color={`${alert.type}`}>
      <span className="text-center">
        <p className="font-medium text-center">{alert.message}</p>
      </span>
    </Alert>
  );
}
