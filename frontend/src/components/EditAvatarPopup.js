import { useEffect } from "react";
import { useForm } from "react-hook-form";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, isLoading, onClose, onUpdateAvatar }) {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const defaultValues = {};
    defaultValues.avatar = "";
    reset({ ...defaultValues });
  }, [isOpen]);

  function onSubmit({ avatar }) {
    onUpdateAvatar({
      avatar: avatar,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      name="avatar"
      title="Обновить аватар"
      onClose={onClose}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
      onSubmit={handleSubmit(onSubmit)}
      isValid={isValid}
    >
      <input
        type="url"
        className="popup__input popup-avatar__input popup__input_type_link"
        placeholder="Ссылка на картинку"
        id="avatar-link"
        {...register("avatar", {
          required: " Заполните поле",
          pattern: {
            value:
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            message: "Введите ссылку на изображение",
          },
        })}
      />
      <span
        className="popup__error popup__error_visible"
        id="avatar-link-error"
      >
        {errors?.avatar && <p>{errors?.avatar.message || "Ощибка"}</p>}
      </span>
    </PopupWithForm>
  );
}
export default EditAvatarPopup;
