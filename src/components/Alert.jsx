import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { alertActions } from "../_store";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiX,
} from "react-icons/hi";

const alertStyles = {
  success: {
    bg: "bg-success/10 border-success/20",
    text: "text-success",
    icon: HiCheckCircle,
  },
  failure: {
    bg: "bg-destructive/10 border-destructive/20",
    text: "text-destructive",
    icon: HiExclamationCircle,
  },
  warning: {
    bg: "bg-warning/10 border-warning/20",
    text: "text-warning",
    icon: HiExclamationCircle,
  },
  info: {
    bg: "bg-primary/10 border-primary/20",
    text: "text-primary",
    icon: HiInformationCircle,
  },
};

export default function DefaultAlert() {
  const dispatch = useDispatch();
  const location = useLocation();
  const alert = useSelector((state) => state.alert.value);

  useEffect(() => {
    dispatch(alertActions.clear());
  }, [dispatch, location]);

  if (!alert) return null;

  const style = alertStyles[alert.type] || alertStyles.info;
  const Icon = style.icon;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-up">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border shadow-soft ${style.bg}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${style.text}`} />
        <p className={`text-sm font-medium flex-1 ${style.text}`}>
          {alert.message}
        </p>
        <button
          onClick={() => dispatch(alertActions.clear())}
          className={`p-1 rounded-md hover:bg-black/5 transition-colors ${style.text}`}
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
