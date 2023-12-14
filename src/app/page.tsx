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

  const [rows, setRows] = React.useState<Availibility[]>([...feRows, ...beRows])
  const [title, setTitle] = React.useState<string>('Sprint 70')
  const [totalDays, setTotalDays] = React.useState<CommonState>({ fe: initTotalFEDays, be: initTotalBEDays })
  const [actualDays, setActualDays] = React.useState<CommonState>({ fe: initTotalFEDays, be: initTotalBEDays })
  const [averageVelocity, setAverageVelocity] = React.useState<CommonState>({ fe: ~~initFeVelo, be: ~~initBeVelo })
  const [actualVelocity, setActualVelocity] = React.useState<CommonState>({ fe: 0, be: 0 })
  const [rollover, setRollover] = React.useState<Rollover[]>([])
  const [rollPoints, setRollPoints] = React.useState<CommonState>({ fe: 0, be: 0 })

  React.useEffect(() => {
    setActualDays(rows.reduce((curr, next) => ({
      fe: curr.fe + ~~next.feDays,
      be: curr.be + ~~next.beDays
    }), { fe: 0, be: 0 }))
  }, [rows])

  React.useEffect(() => {
    const feVelo = Math.round(averageVelocity.fe * (actualDays.fe / totalDays.fe))
    const beVelo = Math.round(averageVelocity.be * (actualDays.be / totalDays.be))

    setActualVelocity({
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
    setRows(rows.map((row) => {
      return (row.id === id)
        ? {
          ...row,
          [key]: value
        }
        : row
    }))
  }

  const handleRolloverChange = (id: string, key: string, value: string) => {
    setRollover(rollover.map((row) => {
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
        <h1 className="font-extrabold text-xl whitespace-nowrap">Capacity Planner</h1>
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
          console.log(JSON.stringify({ actualDays, actualVelocity }, null, 2))
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
          <ErrorStat title="Actual FE Velo" value={`${actualVelocity.fe - rollPoints.fe}`} />
          <ErrorStat title="Actual BE Days" value={`${actualDays.be}`} />
          <ErrorStat title="Actual BE Velo" value={`${actualVelocity.be - rollPoints.be}`} />
        </div>

        <div className="collapse collapse-arrow bg-base-100 mb-4">
          <input type="checkbox" name="my-accordion-1" />
          <div className="collapse-title text-xl font-medium">
            Team Availibility
          </div>
          <div className="collapse-content">
            <Table
              headings={['name', 'feDays', 'beDays', 'notes']}
              rows={rows}
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

        <div className="collapse collapse-arrow bg-base-100">
          <input type="checkbox" name="my-accordion-1" />
          <div className="collapse-title text-xl font-medium">
            Sprint Rollover
          </div>
          <div className="collapse-content">
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
                    handleRolloverChange(row.id, 'fepoints', e.target.value)
                  }} />
                },
                bepoints: (row: Rollover) => {
                  return <Input type="number" value={row.bepoints} onChange={(e) => {
                    handleRolloverChange(row.id, 'bepoints', e.target.value)
                  }} />
                },
                notes: (row: Rollover) => {
                  return <Input value={row.notes} onChange={(e) => {
                    handleChange(row.id, 'beDays', e.target.value)
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
