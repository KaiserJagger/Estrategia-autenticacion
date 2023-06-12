import { userModel } from "./models/users.model.js";
import bcrypt from "bcrypt";

class UserManagerDB {
    // Crea un usuario
    newUser = async ({ first_name, last_name, email, age, password }) => {
        try {
            const regex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,120}$/;
            let errortxt = [];
            (!first_name || first_name.length === 0) &&
                errortxt.push("first_name es obligatorio.");
            (!last_name || last_name.length === 0) &&
                errortxt.push("last_name es obligatorio.");
            (!email || email.length === 0) &&
                errortxt.push("email es obligatorio.");
            (!age || age.length === 0) && errortxt.push("age es obligatorio.");
            age &&
                (isNaN(age) || Number.isInteger(age) || age <= 0) &&
                errortxt.push("age tiene que ser un número positivo.");
            (!password || !regex.test(password)) &&
                errortxt.push(
                    "password debe tener al entre 8 y 120 caracteres, al menos una mayúscula, una minúscula y un caracter especial. " +
                        regex.test(password) + " " + password,
                );

            const found = await userModel
                .findOne({ email: email }).lean().exec();
            if (found !== null) {
                errortxt.push(
                    "Ya se encuentra un usuario registrado con el mismo correo electrónico.",
                );
            }
            if (errortxt.length > 0) {
                return { error: 1, errortxt: errortxt };
            } else {
                const hashpass = bcrypt.hashSync(password, 10);
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashpass,
                };
                const newUser = new userModel(user);
                newUser.save();
                return newUser;
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };

    // Autenticar un usuario existente
    loginUser = async ({ email, password }) => {
        try {
            const found = await userModel.findOne({ email: email }).lean().exec();
            if (
                found !== null &&
                bcrypt.compareSync(password, found.password)
            ) {
                return found;
            } else {
                return {
                    error: 4,
                    errortxt: [
                        "El correo eletrónico o contraseña no son correctos",
                    ],
                };
            }
            return found;
        } catch (error) {
            console.log(error);
            return { error: 3, servererror: error };
        }
    };
}

export { UserManagerDB };
