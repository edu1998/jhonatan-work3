import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import SvgUserCircle from '../../../utils/icons/SvgUser';

export const CustomTableEmptyText = ({ profileCompleted }) => {

    return (
        <div className="home-custom-empty-table-container">
            <div>
                {profileCompleted ?
                    <span className="home-custom-empty-table-title">Nos hay listings para mostrar</span> :
                    <span className="home-custom-empty-table-title">Nos faltan datos para iniciar tu onboarding</span>
                }
            </div>
            <div>
                {profileCompleted ?
                    <span className="home-custom-empty-table-instructions">Tu perfil está completo. Ya podés crear tu primer listing</span> :
                    <span className="home-custom-empty-table-instructions">Hace click para completar tu ficha personal</span>
                }
            </div>
            <div>
                {!profileCompleted &&
                    <Button className="btn-link-filled">
                        <Link className="home-custom-empty-table-button" to="/my-account" >
                            <SvgUserCircle className="home-custom-empty-table-icon" /><span>Mi cuenta</span>
                        </Link>
                    </Button>}
            </div>
        </div>
    )
}