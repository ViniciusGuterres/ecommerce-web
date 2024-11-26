import { useState } from "react";

// images imports
import userPlaceholder from '../images/userDefaultPlaceholder.jpg';

/**
 * @function UploadInput - Input to upload img, returns files in Base64
 * @param {string=} img - The uploaded img Base64
 * @param {string=} dataKey - The img data key to send in onChangeFunction second param
 * @param {function=} onChangeFunction - The function to be called when the uploaded file changed
 */
function UploadInput({ img, dataKey, onChangeFunction }) {
    // Globals vars
    const defaultImg = img || userPlaceholder;

    // States
    const [uploadImgSrc, setUploadImgSrc] = useState(defaultImg);

    // Functions
    /**
     * @function convertBase64 - Will convert the uploaded file to Base64
     * @param {object} file - The uploaded file
     * @returns {string} - Will return the converted Base64 promise
     */
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    /**
     * @function handleFileUploadChange - Will get the file uploaded when change file input, convert it to Base64 and set the "uploadImgSrc" state
     * @param {object} evt - The on change upload input event 
     */
    const handleFileUploadChange = async (evt) => {
        const uploadedFile = evt.target.files[0];
        const base64File = await convertBase64(uploadedFile);

        if (base64File) {
            setUploadImgSrc(base64File);
            onChangeFunction(base64File, dataKey);
        }
    }

    return (
        <div
            className="col-span-6 ml-2 sm:col-span-4 md:mr-3"
        >
            <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="photo">
                Foto de Perfil
            </label>

            <div className="text-center">
                <div className="mt-2" x-show="! photoPreview">
                    <img
                        src={uploadImgSrc}
                        className="w-40 h-40 m-auto rounded-full shadow"
                        alt="user_profile_img"
                    />
                </div>

                <input
                    onChange={evt => handleFileUploadChange(evt)}
                    type="file"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3"
                />
            </div>
        </div>
    );
}

export default UploadInput;