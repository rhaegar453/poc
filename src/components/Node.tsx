import { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import styled from '@emotion/styled';
import { EyeOpenIcon, Pencil2Icon } from '@radix-ui/react-icons';

const NodeContainer = styled.div`
border:1px solid #333333;
border-radius:15px;
transition:0.3s;
padding:5px 20px;
background-color: ${({ color }) => `${color || 'white!important'}`};
`;

const IconSpan = styled.span`
padding: 5px;
border-radius: 4px;
background-color: #f3f3f3;
justify-content: center;
align-items: center;
display: flex;
height: 20px;
width: 20px;
border: 1px solid #e8e8e8;
&:hover{
background-color: aliceblue;
}
`;


function Node({ data, ...rest }: { data: { label: string, color: string } }) {
    const { label, color } = data;
    const [open, setOpen] = useState<boolean>();
    let viewScreenDefinitionEvent = new CustomEvent('view_screen_definition', { detail: { label } })
    let editScreenDefinitionEvent = new CustomEvent('edit_screen_definition', { detail: { label } })

    const handleEditSD = () => {
        document.dispatchEvent(editScreenDefinitionEvent);
    }

    const handleViewSD = () => {
        document.dispatchEvent(viewScreenDefinitionEvent);
    }

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div style={{ position: 'relative' }} onMouseOver={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}>
                <NodeContainer color={color}
                >
                    <p>{label}</p>
                </NodeContainer>
                {open && <div style={{ position: 'absolute', right: '-30px', top: '0px' }}>
                    <div>
                        <IconSpan onClick={handleViewSD}>
                            <EyeOpenIcon />
                        </IconSpan>
                        <IconSpan onClick={handleEditSD} >
                            <Pencil2Icon />
                        </IconSpan>
                    </div>
                </div>}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}


export default Node;

