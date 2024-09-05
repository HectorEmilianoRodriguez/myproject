import React from 'react';
import styles from '../Styles/Form.module.css';

/* Componente funcional para definir un formulario */
const Formulario = (props) => {
    const childrenArray = React.Children.toArray(props.children); /* Se tiene que convertir los children o hijos del componente padre a un array para iterarlos */

    return (
        <form>
            <div className={styles.Wrapper_Form}>
                <h1>{props.title}</h1>

                {props.isFile && props.image && (
                    <div className={styles.ImageContainer}>
                        <img src={URL.createObjectURL(props.image)} alt="Imagen seleccionada" className={styles.ImagePreview} />
                    </div>
                )}

                <p>{props.desc}</p>
                <div className={styles.Form_Inputs}>
                    {props.inputs.map((input, index) => (
                        <div className={styles.Input_Wrapper} key={input.index}>
                            {childrenArray[index] && (
                                <div className={styles.Icon_Wrapper}>
                                    {childrenArray[index]}
                                </div>
                            )}
                            <input
                                className={styles.FormInput}
                                type={input.isPass ? 'password' : 'text'}
                                placeholder={input.placeholder}
                                value={props.values[index]} // Pasar el valor correspondiente
                                onChange={(e) => props.handleChange(e, index)} // Pasar el manejador de cambio correspondiente
                            />
                        </div>
                    ))}

                    {props.isFile && (
                        <div className={styles.Input_Wrapper}>
                            <input
                                type="file"
                                id="file"
                                className={styles.inputFile}
                                accept="image/*"
                                onChange={props.onFileChange} // Manejar el cambio de archivo
                            />
                            <label htmlFor="file" className={styles.customFileInput}>
                                Seleccionar Imagen
                            </label>
                        </div>
                    )}

                    <button type="button" className={styles.ButtonForm} onClick={(e) => props.eventButton(e)}>
                        {props.descButton}
                    </button>
                    {props.alert && <div className={styles.alert}>{props.alert}</div>}
                </div>
            </div>
        </form>
    );
}

export default Formulario;
