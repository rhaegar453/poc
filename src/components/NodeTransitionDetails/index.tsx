import React from "react";
import { INode } from '../../utils';
import styled from '@emotion/styled'

const Title = styled.p`
font-size: 20px;
font-weight: bold;
`;

const ScreenComp = styled.span`
padding: 10px;
font-size: 12px;
border-radius: 5px;
background-color: #f1f1f1;
color: #333333;
cursor: default;
margin: 5px;
display: inline-block;
`;

const NodeTransitionDetails = (nodeDetails: INode) => {
    return (
        <div style={{ height: '300px' }}>
            <div>
                <Title>Next screens</Title>
                <div >
                    {nodeDetails.nextScreens && nodeDetails.nextScreens.map(screen => (
                        <ScreenComp >{screen.id}</ScreenComp>
                    ))}
                </div>
            </div>
            {nodeDetails.previousScreen ? <div>
                <Title>Previous Screens</Title>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {nodeDetails?.previousScreen ? <div>
                        <ScreenComp >{nodeDetails.previousScreen.id}</ScreenComp>
                    </div> : null
                    }
                </div>
            </div> : null}
        </div>
    );
}

export default NodeTransitionDetails