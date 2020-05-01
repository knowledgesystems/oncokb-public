import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import { DOCUMENT_TITLES } from 'app/config/constants';

export const TeamPage = () => {
  return (
    <DocumentTitle title={DOCUMENT_TITLES.TEAM}>
      <div className="team">
        <Row>
          <Col>
            <h2>OncoKB Team</h2>
            <p>
              OncoKB is developed and maintained by the Knowledge Systems group
              in the{' '}
              <a href="https://www.mskcc.org/research-areas/programs-centers/molecular-oncology">
                Marie Josée and Henry R. Kravis Center for Molecular Oncology
              </a>{' '}
              at Memorial Sloan Kettering Cancer Center. Disclosure of conflicts
              of interest of all OncoKB contributors is available{' '}
              <a
                href="https://docs.google.com/spreadsheets/d/1FaOIvQmLXA7Z9rM_WkgP9QPbfkDHoTLKEUGlr0G2UT0/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                here.
              </a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md>
            <h6>Design &amp; Development</h6>
            <ul>
              <li>Debyani Chakravarty, PhD</li>
              <li>Jianjiong Gao, PhD</li>
              <li>Sarah Phillips, PhD</li>
              <li>Hongxin Zhang, MSc</li>
              <li>Ritika Kundra, MSc</li>
              <li>Moriah Nissan, PhD</li>
              <li>Ederlinda Paraiso, MPA</li>
              <li>Julia Rudolph, MPA</li>
              <li>David Solit, MD</li>
              <li>Paul Sabbatini, MD</li>
              <li>Nikolaus Schultz, PhD</li>
            </ul>
            <h6>Current Curators</h6>
            <ul>
              <li>Kinisha Gala, PhD</li>
              <li>Hannah Wise, PhD</li>
              <li>Lindsay M. LaFave, PhD</li>
              <li>Linde Miles, PhD</li>
              <li>Emiliano Cocco, PhD</li>
              <li>Renzo DiNatale, MD</li>
            </ul>
            <h6>Past Contributors</h6>
            <ul>
              <li>Tara Soumerai, MD</li>
              <li>Aphrothiti Hanrahan, PhD</li>
              <li>Anton Henssen, MD</li>
              <li>Tripti Shrestha Bhattarai, PhD</li>
              <li>Fiona Brown, PhD</li>
              <li>Iñigo Landa-Lopez, PhD</li>
              <li>Neel Shah, PhD</li>
              <li>Eneda Toska, PhD</li>
              <li>Jiaojiao Wang, MSc</li>
              <li>Phillip Jonsson, PhD</li>
              <li>David Knorr, MD, PhD</li>
              <li>David Hyman, MD</li>
              <li>Jing Su, MSc</li>
            </ul>
          </Col>
          <Col xs={6} md>
            <h6>Clinical Genomics Annotation Committee</h6>
            <ul>
              <li>Carol Aghajanian, MD</li>
              <li>Maria Arcila, MD</li>
              <li>Michael Berger, PhD</li>
              <li>Margaret Callahan, MD, PhD</li>
              <li>Timothy A. Chan, MD, PhD</li>
              <li>Sarat Chandarlapaty, MD, PhD</li>
              <li>Ping Chi, MD, PhD</li>
              <li>Daniel Danila, MD</li>
              <li>Lisa DeAngelis, MD</li>
              <li>Luis Alberto Diaz, Jr., MD</li>
              <li>Ahmet Dogan, MD, PhD</li>
              <li>Alexander Drilon, MD</li>
              <li>James A. Fagin, MD</li>
              <li>Mrinal M. Gounder, MD</li>
              <li>James J. Harding, MD</li>
              <li>Matthew D. Hellmann, MD</li>
              <li>Alan L. Ho, MD, PhD</li>
              <li>Gopa Iyer, MD</li>
              <li>Edgar A. Jaimes, MD</li>
              <li>Yelena Y. Janjigian, MD</li>
              <li>Philip Kantoff, MD</li>
              <li>David S. Klimstra, MD</li>
              <li>Andrew Kung, MD, PhD</li>
              <li>Marc Ladanyi, MD</li>
            </ul>
          </Col>
          <Col xs={6} md>
            <h6>Clinical Genomics Annotation Committee (continued)</h6>
            <ul>
              <li>C. Ola Landgren, MD, PhD</li>
              <li>Ingo K. Mellinghoff, MD</li>
              <li>Kenneth Offit, MD</li>
              <li>Paul K. Paik, MD</li>
              <li>David G. Pfister, MD</li>
              <li>Dana E. Rathkopf, MD</li>
              <li>Gregory J. Riely, MD, PhD</li>
              <li>Mark E. Robson, MD</li>
              <li>Neal Rosen, MD, PhD</li>
              <li>Leonard Saltz, MD</li>
              <li>Maurizio Scaltriti, PhD</li>
              <li>Howard I. Scher, MD</li>
              <li>Sohrab Shah, PhD</li>
              <li>Alexander N. Shoushtari, MD</li>
              <li>Neerav N. Shukla, MD</li>
              <li>Martin S. Tallman, MD</li>
              <li>William D. Tap, MD</li>
              <li>Barry S. Taylor, PhD</li>
              <li>Tiffany A. Traina, MD</li>
              <li>Martin H. Voss, MD</li>
              <li>Jedd D. Wolchok, MD, PhD</li>
              <li>Rona D. Yaeger, MD</li>
              <li>Anas Younes, MD</li>
            </ul>
          </Col>
        </Row>
      </div>
    </DocumentTitle>
  );
};
