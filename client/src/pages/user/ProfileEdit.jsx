import { useState } from "react";
import Modal from "../../components/CustomModal";
import { TbEditCircle } from "react-icons/tb";

//mui

import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile, setUpdated } from "../../redux/user/userSlice";
import { useForm } from "react-hook-form";

const ProfileEdit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username, email, phoneNumber, adress, _id } = useSelector(
    (state) => state.user.currentUser
  );

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const editProfileData = async (data, id) => {
    try {
      if (data) {
        const formData = data;
        dispatch(editUserProfile({ ...formData }));
        await fetch(`/api/user/editUserProfile/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }),
        });
        // dispatch(editUserProfile(null));
        dispatch(setUpdated(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button type="button" className="" onClick={() => setIsModalOpen(true)}>
        <TbEditCircle />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="bg-white mt-10 rounded-md max-w-[600px] min-w-[360px]"
      >
        <form onSubmit={handleSubmit((data) => editProfileData(data, _id))}>
          <div className="p-8">
            <h2 className="font-bold">Make changes to your profile</h2>
            {/* mui components */}

            <div className="flex flex-col mx-auto md:min-w-[500px]  gap-10 my-10">
              <TextField
                id="username"
                label="Name"
                variant="outlined"
                {...register("username")}
                defaultValue={username}
              />

              <TextField
                id="email"
                label="Email"
                variant="outlined"
                defaultValue={email}
                {...register("email")}
              />
              <TextField
                id="phoneNumber"
                label="Phone"
                type="Number"
                variant="outlined"
                defaultValue={phoneNumber}
                {...register("phoneNumber")}
              />

              <TextField
                id="adress"
                label="Multiline"
                multiline
                rows={4}
                defaultValue={adress}
                {...register("adress")}
              />
            </div>

            {/* mui text feild end here */}

            <div className="flex justify-end items-center gap-x-2">
              <button
                type="button"
                className="w-[100px] rounded-sm text-white bg-red-500 p-2"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="w-[100px] rounded-sm text-white bg-green-500 p-2"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                save
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileEdit;
