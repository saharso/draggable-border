import React from 'react';
import './Demo.scss';
import DraggableBorder from '../DraggableBorder/DraggableBorder';

export type PanelProps = {}

const Demo: React.FunctionComponent<PanelProps> = ({}) => {

    return <>
        <DraggableBorder targetElement={'#panelSidebar_right'} side={'right'} snap={100}/>
        <DraggableBorder targetElement={'#panelSidebar_2'} side={'top'} smartLayout={true} snap={100}/>
        <DraggableBorder targetElement={'#panelSidebar_left'} side={'right'} smartLayout={false} snap={100}/>
        <DraggableBorder targetElement={'#panelSidebar_botom'} side={'bottom'} smartLayout={false} snap={100}/>
        <DraggableBorder targetElement={'#panelSidebar_bottom2'} side={'bottom'} smartLayout={false} snap={100}/>

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
                <aside id="panelSidebar_2" className={'Panel__sidebar'} style={{height: '8em', width: 'auto', paddingBottom: '0'}}>top

                    <aside id="panelSidebar_bottom2" style={{height: '2em', background: '#444'}}>bottom</aside>
                </aside>
            </div>

        </article>
    </>;
};

export default Demo;