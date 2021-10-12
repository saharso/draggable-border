import React from 'react';
import './Demo.scss';
import DraggableBorder from '../DraggableBorder/DraggableBorder';

export type PanelProps = {}

const Demo: React.FunctionComponent<PanelProps> = ({}) => {

    return <>
        <DraggableBorder
            target={'#panelSidebar_right'}
            side={'right'}
        />
        <DraggableBorder target={'#panelSidebar_2'} side={'top'}/>
        <DraggableBorder target={'#panelSidebar_left'} side={'left'}/>
        <DraggableBorder target={'#panelSidebar_botom'} side={'bottom'}/>

        <article className={'Panel'}>

            <aside className={'Panel__addition'}></aside>

            <aside id="panelSidebar_right" className={'Panel__sidebar'}>right</aside>

            <div className={'Panel__main l-column'}>
                <div>
                    <div>
                        <aside id="panelSidebar_botom" className={'Panel__sidebar'} style={{height: '8em', width: 'auto'}}>bottom</aside>
                        <div></div>
                    </div>
                    <aside id="panelSidebar_left" className={'Panel__sidebar'}>left</aside>
                </div>
                <aside id="panelSidebar_2" className={'Panel__sidebar'} style={{height: '8em', width: 'auto'}}>top</aside>
            </div>

        </article>
    </>;
};

export default Demo;