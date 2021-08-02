import Select, { components } from 'react-select';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import classes from './CustomSelect.module.css';

export default function CustomSelect(props) {
  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      {props.selectProps.menuIsOpen ? <FiChevronUp /> : <FiChevronDown />}
    </components.DropdownIndicator>
  );

  const defaultValue = props.options.filter(
    (option) => option.value === props.value
  )[0];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      textAlign: 'left',
      height: '4.5rem',
      backgroundColor: state.isSelected
        ? '#00bbff'
        : state.isFocused
        ? '#99e6ff'
        : '#fff',
      color: (state.isFocused || state.isSelected) && '#fff',
      fontWeight: (state.isFocused || state.isSelected) && '700',
    }),
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.menuIsOpen && '0 2px 2px 2px rgba(0, 191, 255, 0.3)',
      borderColor: state.menuIsOpen ? '#00bbff' : 'hsl(0, 0%, 80%)',

      ':hover': {
        ...provided[':hover'],
        borderColor: '#00bbff',
      },
    }),
  };

  const formatGroupLabel = (data) => (
    <div className={classes.GroupStyles}>
      <span>{data.label}</span>
      <span
        data-testid={`select-badge-${data.options.length}`}
        className={classes.GroupBadge}
      >
        {data.options.length}
      </span>
    </div>
  );

  return (
    <Select
      className={classes[props.inputClasses]}
      onChange={props.changed}
      options={props.options}
      styles={customStyles}
      inputId={props.selectId}
      components={{ DropdownIndicator }}
      defaultValue={defaultValue}
      value={props.value}
      isSearchable={props.isSearchable}
      formatGroupLabel={formatGroupLabel}
    />
  );
}
