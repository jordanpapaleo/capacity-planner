'use client'

import { useSearchParams } from 'next/navigation'
import Input from '@/components/Input';
import React from 'react';
import Stat, { ErrorStat } from '@/components/Stat';
import Table from '@/components/Table';

type CommonState = { fe: number, be: number }

type Rollover = {
  id: string
  story: string
  fepoints: number
  bepoints: number
  notes: string
}

type Availibility = {
  id: string
  name: string
  feDays: number
  beDays: number
  notes: string
}

type Spike = {
  id: string
  story: string
  feDays: number
  beDays: number
  notes: string
}
/*
http://localhost:3000/?feteam=Alexia,Jose,Kemron,Karsten,Paul,Sheldon&beteam=Brad,Bruno,Diego,Vinicius&fevelo=3&bevelo=3
 */
export default function Home() {
  const searchParams = useSearchParams()
  const feTeam: string[] = searchParams.get('feteam')?.split(',').sort() || []
  const beTeam: string[] = searchParams.get('beteam')?.split(',').sort() || []
  const initFeVelo: string = searchParams.get('fevelo') || 0 + ''
  const initBeVelo: string = searchParams.get('bevelo') || 0 + ''
  const feRows: Availibility[] = feTeam.map((t, i) => ({ id: 'fe-' + i, name: t + ' (FE)', feDays: 10, beDays: 0, notes: '' }))
  const beRows: Availibility[] = beTeam.map((t, i) => ({ id: 'be-' + i, name: t + ' (BE)', feDays: 0, beDays: 10, notes: '' }))
  const initTotalFEDays = feTeam.length * 10
  const initTotalBEDays = beTeam.length * 10

  const [title, setTitle] = React.useState<string>('')
  const [teamDays, setTeamDays] = React.useState<Availibility[]>([...feRows, ...beRows])
  const [spikeDays, setSpikeDays] = React.useState<Spike[]>([])
  const [totalDays] = React.useState<CommonState>({ fe: initTotalFEDays, be: initTotalBEDays })
  const [actualDays, setActualDays] = React.useState<CommonState>({ fe: initTotalFEDays, be: initTotalBEDays })
  const [averageVelocity, setAverageVelocity] = React.useState<CommonState>({ fe: ~~initFeVelo, be: ~~initBeVelo })
  const [availablePoints, setAvailablePoints] = React.useState<CommonState>({ fe: 0, be: 0 })
  const [rollover, setRollover] = React.useState<Rollover[]>([])
  const [rollPoints, setRollPoints] = React.useState<CommonState>({ fe: 0, be: 0 })

  React.useEffect(() => {
    const reducedTeamDays = teamDays.reduce((curr, next) => ({
      fe: curr.fe + ~~next.feDays,
      be: curr.be + ~~next.beDays,
    }), { fe: 0, be: 0 })

    const reducedTeamAndSpikeDays = spikeDays.reduce((curr, next) => ({
      fe: curr.fe + ~~next.feDays * -1,
      be: curr.be + ~~next.beDays * -1,
    }), reducedTeamDays)

    setActualDays(reducedTeamAndSpikeDays)
  }, [teamDays, spikeDays])

  React.useEffect(() => {
    const feVelo = Math.round(averageVelocity.fe * (actualDays.fe / totalDays.fe))
    const beVelo = Math.round(averageVelocity.be * (actualDays.be / totalDays.be))

    setAvailablePoints({
      fe: isNaN(feVelo) ? 0 : feVelo,
      be: isNaN(beVelo) ? 0 : beVelo,
    })
  }, [actualDays, totalDays, averageVelocity])

  React.useEffect(() => {
    setRollPoints(rollover.reduce((curr, next) => ({
      fe: curr.fe + ~~next.fepoints,
      be: curr.be + ~~next.bepoints
    }), { fe: 0, be: 0 }))
  }, [rollover])

  const handleChange = (id: string, key: string, value: string) => {
    setTeamDays(teamDays.map((row) => {
      return (row.id === id)
        ? {
          ...row,
          [key]: value
        }
        : row
    }))
  }

  const handleRolloverChange = (id: string, key: string, value: string | number) => {
    setRollover(rollover.map((row) => {
      return (row.id === id)
        ? {
          ...row,
          [key]: value
        }
        : row
    }))
  }

  const handleSpikeChange = (id: string, key: string, value: string | number) => {
    setSpikeDays(spikeDays.map((row) => {
      return (row.id === id)
        ? {
          ...row,
          [key]: value
        }
        : row
    }))
  }

  return (
    <main className="min-h-screen mb-16">
      <header className="navbar gap-4 bg-base-100 mb-8">
        <h1 className="font-extrabold text-xl whitespace-nowrap">
          <div className="mr-2">Capacity Planner</div>
          <div className="tooltip tooltip-right" data-tip="?feteam=&beteam=&fevelo=&bevelo=">
            <div className="badge badge-neutral">qp</div>
          </div>
        </h1>
        <Input value={title} placeholder="Title" onChange={(e) => {
          setTitle(e.target.value)
        }} />
        <div>
          <strong>FE Velo</strong>
          <Input value={averageVelocity.fe} placeholder="FE Average Velo" onChange={(e) => {
            setAverageVelocity({
              ...averageVelocity,
              fe: ~~e.target.value
            })
          }} />
        </div>
        <div>
          <strong>BE Velo</strong>
          <Input value={averageVelocity.be} placeholder="BE Average Velo" onChange={(e) => {
            setAverageVelocity({
              ...averageVelocity,
              be: ~~e.target.value
            })
          }} />
        </div>
        <button className="btn btn-neutral" type="button" onClick={() => {
          console.log(JSON.stringify({
            title,
            actualDays,
            availablePoints,
            spikeDays,
            rollover,
            rollPoints,
          }, null, 2))
        }}>Save Plan</button>
      </header>

      <div className="container mx-auto max-w-[750px]">
        <div className="stats mb-8 w-full">
          <Stat title="Standard FE Days" value={`${totalDays.fe}`} />
          <Stat title="Average FE Velo" value={`${averageVelocity.fe}`} />
          <Stat title="Standard BE Days" value={`${totalDays.be}`} />
          <Stat title="Average BE Velo" value={`${averageVelocity.be}`} />
        </div>

        <div className="stats mb-8 w-full">
          <ErrorStat title="Actual FE Days" value={`${actualDays.fe}`} />
          <ErrorStat title="Available FE Points" value={`${availablePoints.fe - rollPoints.fe}`} />
          <ErrorStat title="Actual BE Days" value={`${actualDays.be}`} />
          <ErrorStat title="Available BE Points" value={`${availablePoints.be - rollPoints.be}`} />
        </div>

        <div className="collapse collapse-arrow bg-base-100 mb-4">
          <input type="checkbox" name="team" />
          <div className="collapse-title text-xl font-medium">
            Team Availible Days
          </div>
          <div className="collapse-content">
            <p className="text-s mb-4">0 - 10 engineer days per sprint. A decrease in days decrease available time in the sprint</p>
            <Table
              headings={['name', 'feDays', 'beDays', 'notes']}
              rows={teamDays}
              renderOverride={{
                feDays: (row: Availibility) => {
                  return <Input type="number" value={row.feDays} onChange={(e) => {
                    handleChange(row.id, 'feDays', e.target.value)
                  }} />
                },
                beDays: (row: Availibility) => {
                  return <Input type="number" value={row.beDays} onChange={(e) => {
                    handleChange(row.id, 'beDays', e.target.value)
                  }} />
                },
                notes: (row: Availibility) => {
                  return <Input value={row.notes} onChange={(e) => {
                    handleChange(row.id, 'beDays', e.target.value)
                  }} />
                }
              }}
            />
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-100 mb-4">
          <input type="checkbox" name="spikes" />
          <div className="collapse-title text-xl font-medium">
            Spike Days
          </div>
          <div className="collapse-content">
            <p className="text-s mb-4">Spikes are 0 points and timeboxed to a set number of days. An increase in spike days decrease available time in the sprint</p>
            <Table
              headings={['story', 'feDays', 'beDays', 'notes']}
              rows={spikeDays}
              renderOverride={{
                story: (row: Spike) => {
                  return <Input value={row.story} onChange={(e) => {
                    handleSpikeChange(row.id, 'story', e.target.value)
                  }} />
                },
                feDays: (row: Spike) => {
                  return <Input type="number" value={row.feDays} onChange={(e) => {
                    handleSpikeChange(row.id, 'feDays', ~~e.target.value)
                  }} />
                },
                beDays: (row: Spike) => {
                  return <Input type="number" value={row.beDays} onChange={(e) => {
                    handleSpikeChange(row.id, 'beDays', ~~e.target.value)
                  }} />
                },
                notes: (row: Spike) => {
                  return <Input value={row.notes} onChange={(e) => {
                    handleSpikeChange(row.id, 'notes', e.target.value)
                  }} />
                }
              }}
            />

            <button
              type="button"
              className="btn btn-neutral mt-8"
              onClick={() => {
                setSpikeDays([
                  ...spikeDays,
                  {
                    id: '' + Date.now(),
                    story: '',
                    feDays: 0,
                    beDays: 0,
                    notes: ''
                  }
                ])
              }}
            >
              Add Spike
            </button>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-100">
          <input type="checkbox" name="rollover" />
          <div className="collapse-title text-xl font-medium">
            Sprint Rollover
          </div>
          <div className="collapse-content">
            <p className="text-s mb-4">Sprint rollover is measured in points.  An increase in rolled points decreases the available points</p>
            <Table
              headings={['story', 'fepoints', 'bepoints', 'notes']}
              rows={rollover}
              renderOverride={{
                story: (row: Rollover) => {
                  return <Input value={row.story} onChange={(e) => {
                    handleRolloverChange(row.id, 'story', e.target.value)
                  }} />
                },
                fepoints: (row: Rollover) => {
                  return <Input type="number" value={row.fepoints} onChange={(e) => {
                    handleRolloverChange(row.id, 'fepoints', ~~e.target.value)
                  }} />
                },
                bepoints: (row: Rollover) => {
                  return <Input type="number" value={row.bepoints} onChange={(e) => {
                    handleRolloverChange(row.id, 'bepoints', ~~e.target.value)
                  }} />
                },
                notes: (row: Rollover) => {
                  return <Input value={row.notes} onChange={(e) => {
                    handleRolloverChange(row.id, 'notes', e.target.value)
                  }} />
                }
              }}
            />

            <button
              type="button"
              className="btn btn-neutral mt-8"
              onClick={() => {
                setRollover([
                  ...rollover,
                  {
                    id: '' + Date.now(),
                    story: '',
                    fepoints: 0,
                    bepoints: 0,
                    notes: ''
                  }
                ])
              }}
            >
              Add Story
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
