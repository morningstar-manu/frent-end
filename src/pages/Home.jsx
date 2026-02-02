import React, { useState } from "react";
import { AppointmentList } from "../appointments/AppointmentList";
import { Button, Modal } from "flowbite-react";
import { AppointmentAdd } from "../appointments/AppointmentAdd";

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleClose = () => {
    setRefreshList((prevState) => !prevState);
    setOpenModal(false);
  };

  return (
    <>
      <div className="flex flex-col item-center">
        <p className="text-x1 font-semibold leading-tight mb-4 flex justify-center">
          Welcome Marketer
        </p>
      </div>

      <div className="py-12 w-full flex justify-center">
        <Button className="flex md:order-4" onClick={() => setOpenModal(true)}>
          Add Appointment
        </Button>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create new appointment</Modal.Header>
        <Modal.Body>
          <AppointmentAdd closeModal={handleClose} />
        </Modal.Body>
      </Modal>

      {/* <div> */}
      <AppointmentList refreshList={refreshList} />
      {/* </div> */}
    </>
  );
}
