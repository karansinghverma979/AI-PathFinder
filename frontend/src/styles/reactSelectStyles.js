export const selectStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid #4A5568',
        borderRadius: '0.5rem',
        minHeight: '48px',
        color: 'white',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#6366F1',
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#1E293B',
        border: '1px solid #4A5568',
        borderRadius: '0.5rem',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#6366F1' : state.isFocused ? 'rgba(99, 102, 241, 0.3)' : '#1E293B',
        color: 'white',
        '&:active': {
            backgroundColor: '#4F46E5',
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'white',
    }),
    input: (provided) => ({
        ...provided,
        color: 'white',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9CA3AF',
    }),
};
