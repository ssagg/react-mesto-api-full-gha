import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const currentUser = useContext(CurrentUserContext);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const defaultValues = {};
    defaultValues.name = currentUser.name;
    defaultValues.about = currentUser.about;
    reset({ ...defaultValues });
  }, [currentUser, isOpen]);

  function onSubmit({ name, about }) {
    onUpdateUser({
      name,
      about,
    });
  }
  return (
    <PopupWithForm
      isOpen={isOpen}
      name="profile"
      title="Редактировать профиль"
      onClose={onClose}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
      onSubmit={handleSubmit(onSubmit)}
      isValid={isValid}
    >
      <input
        type="text"
        className="popup__input popup__input_type_name"
        placeholder="Ваше имя"
        id="profile-name"
        {...register("name", {
          required: "Заполните поле",
          minLength: { value: 2, message: "Минимум 2 символа максимум 40" },
          maxLength: {
            value: 40,
            message: "Минимум 2 символа максимум 40",
          },
        })}
      />
      <span
        className="popup__error
        popup__error_visible"
        id="profile-name-error"
      >
        {errors?.name && <p>{errors?.name.message || "Ощибка"}</p>}
      </span>
      <input
        type="text"
        className="popup__input popup__input_type_about"
        placeholder="Род занятий"
        id="profile-about"
        {...register("about", {
          required: "Заполните поле",
          minLength: { value: 2, message: "Минимум 2 символа максимум 40" },
          maxLength: {
            value: 200,
            message: "Минимум 2 символа максимум 40",
          },
        })}
      />
      <span
        className="popup__error popup__error_visible"
        id="profile-about-error"
      >
        {errors?.about && <p>{errors?.about.message || "Ошибка"}</p>}
      </span>
    </PopupWithForm>
  );
}
export default EditProfilePopup;
