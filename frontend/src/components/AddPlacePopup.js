import PopupWithForm from "./PopupWithForm";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function AddPlacePopup({ onAddPlace, isOpen, onClose, isLoading }) {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const defaultValues = {};
    defaultValues.name = "";
    defaultValues.link = "";
    reset({ ...defaultValues });
  }, [isOpen]);

  function onSubmit({ name, link }) {
    onAddPlace({
      name,
      link,
    });
  }
  return (
    <PopupWithForm
      isOpen={isOpen}
      name="place"
      title="Новое место"
      onClose={onClose}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
      onSubmit={handleSubmit(onSubmit)}
      isValid={isValid}
    >
      <input
        type="text"
        className="popup__input popup-place__input popup__input_type_place"
        placeholder="Название"
        id="place-name"
        {...register("name", {
          required: " Заполните поле",
          minLength: { value: 2, message: "Минимум 2 символа максимум 40" },
          maxLength: {
            value: 40,
            message: "Минимум 2 символа максимум 40",
          },
        })}
      />
      <span className="popup__error popup__error_visible" id="place-name-error">
        {errors?.name && <p>{errors?.name.message || "Ощибка"}</p>}
      </span>
      <input
        type="url"
        className="popup__input popup-place__input popup__input_type_link"
        placeholder="Ссылка на картинку"
        id="place-link"
        {...register("link", {
          required: " Заполните поле",
          pattern: {
            value:
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            message: "Вееди ссылку",
          },
        })}
      />
      <span className="popup__error popup__error_visible" id="place-link-error">
        {errors?.link && <p>{errors?.link.message || "Ощибка"}</p>}
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
