import React from 'react'
import { Icon, Image, Statistic } from 'semantic-ui-react'

const Statistics = () => (
  <Statistic.Group widths='four'>
    <Statistic>
      <Statistic.Value>22.562</Statistic.Value>
      <Statistic.Label>Yorum</Statistic.Label>
    </Statistic>

    <Statistic>
      <Statistic.Value text>
        Yüz
        <br />
        Bin
      </Statistic.Value>
      <Statistic.Label>Katılımcı</Statistic.Label>
    </Statistic>

    <Statistic>
      <Statistic.Value>
        <Icon name="calendar alternate outline" />5,432
      </Statistic.Value>
      <Statistic.Label>Aktivite</Statistic.Label>
    </Statistic>

    <Statistic>
      <Statistic.Value>
        <Image src={'/assets/HomePNG.png'} className='circular inline' />
        1150
      </Statistic.Value>
      <Statistic.Label>Eğitmen</Statistic.Label>
    </Statistic>
  </Statistic.Group>
)

export default Statistics