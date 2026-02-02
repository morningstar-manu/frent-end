import React from "react";
import { Button, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AppointmentService } from "../_helpers";
import { alertActions } from "../_store";
import { useQueryClient } from "react-query";
import { useWeekManager } from "../utils/dateUtils";
import DatePickerDate from "./DatePickerDate";
import DatePickerTime from "./DatePickerTime";
import SalesRepresentativeSelect from "./SalesRepresentativeSelect";
import {
  HiUser,
  HiPhone,
  HiLocationMarker,
  HiAnnotation,
  HiUserCircle,
  HiCalendar,
  HiCheck,
  HiX,
} from "react-icons/hi";

const AppointmentAdd = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const { week } = useWeekManager();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      commercial: "",
      date: "",
      time: "",
      name: "",
      phone_1: "",
      phone_2: "",
      address: "",
      comment: "",
    },
  });

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const onSubmit = async (data) => {
    const userId = user?.id ?? "";

    try {
      data.commercial = removeAccents(
        data.commercial.toLowerCase().replace(/\s+/g, "-")
      );

      await AppointmentService.createAppointment(userId, data);
      await queryClient.invalidateQueries("appointmentByUserId");
      await queryClient.invalidateQueries(["appointmentsByWeek", week]);

      dispatch(alertActions.success("Rendez-vous ajoute avec succes"));
      closeModal();
      reset();
    } catch (err) {
      console.log(err);
      dispatch(alertActions.error(err));
    }

    setTimeout(() => {
      dispatch(alertActions.clear());
    }, 2000);
  };

  const handleCancel = () => {
    reset();
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Commercial & Date/Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commercial */}
        <div className="space-y-2">
          <label
            htmlFor="commercial"
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <HiUserCircle className="w-4 h-4 text-primary" />
            Commercial
          </label>
          <SalesRepresentativeSelect register={register} />
          {errors.commercial && (
            <span className="text-xs text-destructive">
              {errors.commercial.message}
            </span>
          )}
        </div>

        {/* Date & Time */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <HiCalendar className="w-4 h-4 text-primary" />
            Date et Heure
          </label>
          <div className="flex gap-3">
            <DatePickerDate register={register} />
            <DatePickerTime register={register} />
          </div>
          {(errors.date || errors.time) && (
            <span className="text-xs text-destructive">
              {errors.date?.message || errors.time?.message}
            </span>
          )}
        </div>
      </div>

      {/* Patient Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <HiUser className="w-4 h-4 text-primary" />
          Nom complet du patient
        </label>
        <input
          type="text"
          id="name"
          autoComplete="off"
          placeholder="Entrez le nom complet"
          className="input-field"
          {...register("name", { required: "Ce champ est requis" })}
        />
        {errors.name && (
          <span className="text-xs text-destructive">{errors.name.message}</span>
        )}
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="phoneFixe"
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <HiPhone className="w-4 h-4 text-primary" />
            Telephone fixe
          </label>
          <input
            type="text"
            id="phoneFixe"
            autoComplete="off"
            placeholder="05XX XXX XXX"
            className="input-field"
            {...register("phone_1")}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="phoneMobile"
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <HiPhone className="w-4 h-4 text-primary" />
            Telephone mobile
          </label>
          <input
            type="text"
            id="phoneMobile"
            autoComplete="off"
            placeholder="06XX XXX XXX"
            className="input-field"
            {...register("phone_2")}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label
          htmlFor="address"
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <HiLocationMarker className="w-4 h-4 text-primary" />
          Adresse
        </label>
        <input
          type="text"
          id="address"
          autoComplete="off"
          placeholder="Casablanca, Maroc"
          className="input-field"
          {...register("address")}
        />
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <HiAnnotation className="w-4 h-4 text-primary" />
          Commentaire
        </label>
        <textarea
          id="comment"
          rows={3}
          placeholder="Ajouter des notes supplementaires..."
          className="input-field resize-none"
          {...register("comment")}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button color="gray" onClick={handleCancel} className="flex items-center gap-2">
          <HiX className="w-4 h-4" />
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2"
        >
          {isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            <>
              <HiCheck className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export { AppointmentAdd };
