import React from "react";
import { Button, Label, Modal, Spinner, TextInput, Textarea } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AppointmentService } from "../_helpers";
import { alertActions } from "../_store";
import { useQueryClient } from "react-query";
import { useWeekManager } from "../utils/dateUtils";
import DatePickerDate from "./DatePickerDate";
import DatePickerTime from "./DatePickerTime";
import SalesRepresentativeSelect from "./SalesRepresentativeSelect";

const AppointmentAdd = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const { week } = useWeekManager();

  // Add validation rules for each input field
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
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

      dispatch(alertActions.success("Appointment successfully added"));
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
    <>
      <div className="max-auto w-full ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <Label
                htmlFor="commercial"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Sales Representative
              </Label>
              <SalesRepresentativeSelect register={register} />

              {errors.commercial && (
                <span className="text-red-500">
                  {errors.commercial.message}
                </span>
              )}
            </div>

            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <Label
                  htmlFor="date_1"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Date and Time
                </Label>

                <div className="flex space-x-2">
                  <DatePickerDate register={register} />
                  <DatePickerTime register={register} />
                </div>
                {errors.date && (
                  <span className="text-red-500">{errors.date.message}</span>
                )}
                {errors.time && (
                  <span className="text-red-500">{errors.time.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <Label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Full Name
            </Label>
            <TextInput
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              placeholder="Full Name"
              {...register("name", { required: "This field is required" })}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <Label
                htmlFor="phoneFixe"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Phone (fixe)
              </Label>
              <TextInput
                type="text"
                name="phoneFixe"
                id="phoneFixe"
                autoComplete="off"
                placeholder="Fixe"
                {...register("phone_1")}
              />
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <Label
                htmlFor="phoneMobile"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Phone (mobile)
              </Label>
              <TextInput
                type="text"
                name="phoneMobile"
                id="phoneMobile"
                autoComplete="off"
                placeholder="Mobile"
                {...register("phone_2")}
              />
            </div>
          </div>

          <div className="mb-5">
            <Label
              htmlFor="address"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Address
            </Label>
            <TextInput
              type="text"
              name="address"
              autoComplete="off"
              id="address"
              placeholder="Casablanca, Maroc"
              {...register("address")}
            />
          </div>

          <div className="mb-5">
            <Label
              htmlFor="comment"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Comment
            </Label>
            <Textarea
              type="text"
              name="comment"
              id="comment"
              placeholder="Comment"
              {...register("comment")}
            />
          </div>

          <Modal.Footer>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Spinner /> : "Save"}
            </Button>
            <Button color="gray" onClick={handleCancel}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </div>
    </>
  );
};

export { AppointmentAdd };
