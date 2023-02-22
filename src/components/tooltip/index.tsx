import React, { PropsWithChildren, ReactNode } from 'react';
import * as TooltipBase from '@radix-ui/react-tooltip';
import './styles.css';


const Tooltip = (props: PropsWithChildren<{ trigger: ReactNode }> & TooltipBase.TooltipProps) => {
    const { children, trigger, ...rest } = props;
    return (
        <TooltipBase.Provider >
            <TooltipBase.Root delayDuration={200}{...rest}>
                <TooltipBase.Trigger asChild>
                    {trigger}
                </TooltipBase.Trigger>
                <TooltipBase.Portal>
                    <TooltipBase.Content>
                        {children}
                    </TooltipBase.Content>
                </TooltipBase.Portal>
            </TooltipBase.Root>
        </TooltipBase.Provider>
    );
};

export default Tooltip;