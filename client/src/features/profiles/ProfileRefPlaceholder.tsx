import React from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Header, Placeholder, Segment } from 'semantic-ui-react'
export const ProfileRefPlaceholder = () => {
    const smallItemStyles: React.CSSProperties = {
      cursor: 'pointer',
      objectFit: 'cover',
      width: '100%',
      maxHeight: '100%',
    }
    return (
<>
        <Header>Referans İşler
        {/* <Icon name="comment outline"></Icon> */}
    </Header>
      <Gallery id="simple-gallery">
      <Segment raised>
              <Placeholder>
                <Placeholder.Image>
                </Placeholder.Image>
                <Placeholder.Image>
                </Placeholder.Image>
              </Placeholder>
            </Segment>
            
      </Gallery>
      </>
    )
  }
