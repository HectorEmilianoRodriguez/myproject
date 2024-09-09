import React from 'react';
import styles from '../Styles/Form.module.css';
import CreatableSelect from 'react-select/creatable';

/* Componente funcional para definir un formulario */
const Formulario = (props) => {
    const childrenArray = React.Children.toArray(props.children); /* Se tiene que convertir los children o hijos del componente padre a un array para iterarlos */
    const options = [
        { value: 'redes', label: 'Redes de computadoras' },
        { value: 'software', label: 'Desarrollo de software' },
        { value: 'arquitectura', label: 'Arquitectura' },
    ];

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
                {props.alert && <div className={styles.alert}>{props.alert}</div>}

                <div className={styles.Form_Inputs}>
                    {props.inputs.map((input, index) => (
                        <div className={styles.Input_Wrapper} key={input.index}>
                            {childrenArray[index] && (
                                <div className={styles.Icon_Wrapper}>
                                    {childrenArray[index]}
                                </div>
                            )}
                            {input.isDate ? (
                                <div className={styles.DateWrapper}>
                                    <input
                                        className={styles.FormInput}
                                        type="date"
                                        value={props.values[index]} // Pasar el valor correspondiente
                                        onChange={(e) => props.handleChange(e, index)} // Pasar el manejador de cambio correspondiente
                                    />
                                    <label className={styles.DatePlaceholder}>{input.placeholder}</label>
                                </div>
                            ) : (
                                <input
                                    className={styles.FormInput}
                                    type={input.isPass ? 'password' : 'text'}
                                    placeholder={input.placeholder}
                                    onChange={(e) => props.handleChange(e, index)} // Pasar el manejador de cambio correspondiente
                                />
                            )}
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

                    {props.isBox && (
                        <CreatableSelect
                            value={props.selectedOption ? { label: props.selectedOption, value: props.selectedOption } : null}
                            onChange={props.handleSelectChange}
                            options={options}
                            isSearchable={true}  // Habilita la escritura y búsqueda
                            placeholder={props.descSelect}
                            isClearable={true}  // Permite limpiar la selección
                            onCreateOption={(inputValue) => props.handleSelectChange({ value: inputValue, label: inputValue }, { action: 'create-option' })}
                        />
                    )}

                    {props.isTextArea && (
                        <textarea
                            className={styles.FormTextArea}
                            placeholder="Escribe aquí..."
                            value={props.textAreaValue}  // Valor del textarea
                            onChange={props.handleTextAreaChange}  // Manejador del cambio
                        />
                    )}
                    <div>
                             <button type="button" className={styles.ButtonForm} onClick={(e) => props.eventButton(e)}>
                                {props.descButton}
                            </button>
                            {props.secondButton && (
                                <button type="button" className={styles.ButtonForm2} onClick={(e) => props.eventButton2(e)}>
                                {props.descButton2}
                                </button>
                            )}

                    </div>
                       
                   
                </div>
            </div>
        </form>
    );
}

export default Formulario;
