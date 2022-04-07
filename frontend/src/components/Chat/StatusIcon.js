import './StatusIcon.css'


function StatusIcon({ connected }) {



    return (
        <i className={`icon ${connected}`}></i>
    )
}

export default StatusIcon;
