import React from "react";
import { INode } from '../../utils';
import styled from '@emotion/styled'
import Tooltip from "../tooltip";
import { useReactFlow } from "reactflow";


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
const ToolTipContent = styled.div`
background-color: white;
padding: 5px;
border-radius: 4px;
color: #333333;
font-size: 10px;
border: 1px solid #e8e8e8;
`;

const NodeTransitionDetails = (nodeDetails: INode) => {
    const { fitView } = useReactFlow();
    const handleViewNode = (value: string) => {
        let pannableEvent = new CustomEvent('pan_to_node', { detail: value })
        document.dispatchEvent(pannableEvent)
        fitView({ nodes: [{ id: value }], duration: 2000 })
    }
    return (
        <div style={{ height: '300px' }}>
            <div>
                <Title>Next screens</Title>
                <div >
                    {nodeDetails.nextScreens && nodeDetails.nextScreens.map(screen => (
                        <Tooltip trigger={<ScreenComp >{screen.id}</ScreenComp>}>
                            <ToolTipContent >
                                <p>{JSON.stringify(screen.condition.expression)}</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button>Edit Transition</button>
                                    <button onClick={() => handleViewNode(screen.id)} style={{ marginLeft: '10px' }}>View Screen</button>
                                </div>
                            </ToolTipContent>
                        </Tooltip>
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