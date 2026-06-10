import Timeline, { CustomMarker, DateHeader, SidebarHeader, TimelineHeaders, TimelineMarkers } from 'react-calendar-timeline';
import moment from 'moment';


export default function TimeLineLectra({ data, groups, size = "normal", showHeader = true, classNames = '', hoursQty = 5 }) {

    return (
        <div className={` ${classNames}`}>
            <Timeline
                maxZoom={20 * 60 * 60 * 160}
                groups={groups}
                className={`text-3xl flex-col ${size == "normal" ? 'py-4' : 'py-1'}`}
                lineHeight={size == "normal" ? 70 : 80}
                // buffer={1}
                itemHeightRatio={size == 'normal' ? .9 : .8}

                groupRenderer={({ group }) => {
                    return (
                        // bg-[#f2f2f2]
                        <div className={`${group.bg} flex ${size == 'normal' ? 'text-5xl' : 'text-2xl'} flex-col font-bold items-center justify-center h-full w-full `}>
                            {group.title.split('-').map((l, idx) => (
                                <span key={idx}>{l}</span>
                            ))}
                        </div>
                    )
                }}

                itemRenderer={({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
                    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
                    const backgroundColor = itemContext.selected ? (itemContext.dragging ? "red" : 'red') : item.bgColor;
                    // const borderColor = itemContext.resizing ? "red" : item.color;
                    const borderColor = 'black'

                    return (

                        <div
                            {...getItemProps({
                                style: {
                                    // height: 10,
                                    backgroundColor,
                                    color: 'black',
                                    borderColor,
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderRadius: 20,
                                    borderLeftWidth: itemContext.selected ? 5 : 5,
                                    borderRightWidth: itemContext.selected ? 5 : 5,
                                    marginRight: 10,
                                    fontSize: 40
                                },
                            })}
                        >
                            {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

                            <div
                                style={{
                                    height: itemContext.dimensions.height,
                                    overflow: "hidden",
                                    paddingLeft: 3,
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                    fontSize: size == 'small' ? 50 : 40,
                                    fontWeight: "bold"
                                }}
                            >
                                <div className='flex w-full items-center justify-center px-2'>
                                    <span className={`px-4`}>{itemContext.title}</span>
                                    {/* <span className={`px-4`}>{itemContext.title}</span>
                                    <span className={`px-4`}>{itemContext.title}</span> */}
                                </div>
                            </div>

                            {/* {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null} */}
                        </div>
                    )
                }}


                items={data?.map((i, idx) => {
                    // console.log(i)
                    return {
                        id: `${idx}-${i?.lectra}`,
                        group: i?.group,
                        // title: i?.modelo,
                        title: i?.material?.codigo_interno,
                        // title: i?.modelo == 'CAM. TURNO' ? i?.modelo : i?.material?.codigo_interno,
                        start_time: moment(i?.inicio, 'Y-M-D H:m:s'),
                        end_time: moment(i?.fin, 'Y-M-D H:m:s'),
                        bgColor: i?.modelo.search('STOP') >= 0 ? 'lightyellow' : (i?.group?.search('R-') >= 0 ? (i?.demora > 0 ? 'tomato' : 'mediumseagreen') : 'skyblue')//getBgColor(moment(i?.fin, 'Y-M-D H:m:s'), moment(i?.inicio, 'Y-M-D H:m:s'))
                    }
                })}

                defaultTimeStart={moment().add(-30, 'minute')}
                defaultTimeEnd={moment().add(hoursQty, 'hour')}

                timeSteps={{
                    second: 0,
                    minute: 30,
                    hour: 0,
                    day: 0,
                    month: 0,
                    year: 0
                }}

                sidebarWidth={200}
            >
                <TimelineMarkers>
                    <CustomMarker date={new Date().getTime()}>
                        {({ styles, date }) => {
                            const customStyles = {
                                ...styles,
                                backgroundColor: 'red',
                                width: '15px',
                                borderRadius: 4,
                                zIndex: 99
                            }
                            return <div style={customStyles} />
                        }}
                    </CustomMarker>
                </TimelineMarkers>

                <TimelineHeaders className=''>
                    <SidebarHeader>
                        {({ getRootProps }) => {
                            return <div {...getRootProps()} className='bg-gray-200'></div>;
                        }}
                    </SidebarHeader>
                    {showHeader &&
                        <DateHeader
                            intervalRenderer={({ getIntervalProps, intervalContext, data }) => {
                                return <div {...getIntervalProps()} className={`bg-gray-200 font-bold h-full border-r-2 px-2 border-gray-400 ${size == 'normal' ? 'text-4xl' : 'text-xl'} flex items-center justify-center`}>
                                    {intervalContext.intervalText}
                                </div>
                            }}
                            height={80}
                            style={{ fontSize: 40 }}
                        />
                    }

                </TimelineHeaders>
            </Timeline>
        </div>
    )
}
