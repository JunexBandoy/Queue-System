interface Props {
    children?: React.ReactNode;
}

export const BoxRowColumn: React.FC<Props> = ({children}) => {
    return (
        <div className="flex space-x-4">
            {children}
        </div>
    )
}
