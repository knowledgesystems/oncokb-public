'use strict';

/**
 * @ngdoc function
 * @name oncokbStaticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the oncokbStaticApp
 */
angular.module('oncokbStaticApp')
    .controller('NewsCtrl', function($scope, $rootScope) {
        $scope.data = {
            citationURL: $rootScope.data.citationURL
        };
        $scope.data.updatedActionableGenes = {
            '03072017': {
                'Level 1': [
                    'Updated alterations for EGFR - Non-Small Cell Lung Cancer - EGFR TKIs',
                    'Updated alterations for KIT - Gastrointestinal Stromal Tumor - Imatinib, Sunitinib, Regorafenib'
                ],
                'Level 2': [
                    'CDK4 - Amplification - Well-Differentiated Liposarcoma/Dedifferentiated Liposarcoma - Palbociclib, Abemaciclib (<b>disease changed from Soft Tissue Sarcoma and Abemaciclib added</b>)',
                    'TSC1 - Renal Cell Carcinoma - Everolimus (<b>new association</b>)'
                ],
                'Level 3': [
                    'ESR1 - Oncogenic Mutations - AZD9496, Fulvestrant (<b>new association</b>)',
                    'FGFR1 - Amplification - Breast Cancer - Dovitinib (<b>removed</b>)',
                    'FGFR1 - Amplification - Lung Squamous Cell Carcinoma - Debio1347 (<b>new association</b>)',
                    'FGFR2 - Amplification - Breast Cancer - Dovitinib (<b>removed</b>)',
                    'FGFR2/3 - Fusions - Various tumor types - Debio1347 (<b>new association</b>)',
                    'FGFR3 - Hotspots - Bladder Cancer - Debio1347, JNJ-42756493 (<b>new association</b>)',
                    'KRAS - Oncogenic Mutations - Colorectal Cancer - Atezolizumab+Cobimetinib (<b>moved from Level 4 to 3A only in CRC</b>)',
                    'MDM2 - Amplification - Liposarcoma - DS-3032b and RG7112 (<b>new association</b>)',
                    'PIK3CA - Oncogenic Mutations - Breast Cancer - Alpelisib+Fulvestrant, Buparlisib+Fulvestrant, Copanlisib, GDC0077, Serabelisib, Fulvestrant+Taselisib (<b>new drugs added</b>)'
                ],
                'Level 4': [
                    'EGFR alterations - Glioma - Erlotinib (<b>removed</b>)',
                    'MDM2 - Amplification - Liposarcoma - DS-3032b (<b>moved to Level 3A</b>)',
                    'PIK3CA - Oncogenic Mutations - Breast Cancer - Alpelisib+Fulvestrant (<b>moved to Level 3A</b>)',
                    'IDH1 - R132 alterations - Chondrosarcoma - AG-120 (<b>moved from Level 3A to 4</b>)'
                ]
            },
            '04052017': {
                'Level 1': [
                    'BRCA1/2 – Oncogenic Mutations – Ovarian Cancer – Niraparib FDA approval added',
                    'BRCA1/2 – Oncogenic Mutations – Ovarian Cancer - Rucaparib (<b>new publication added</b>)',
                    'Updated alterations for KIT - Gastrointestinal Stromal Tumor - Imatinib, Sunitinib, Regorafenib'
                ],
                'Level 2': [
                    'Updated alterations for KIT - Gastrointestinal Stromal Tumor – Nilotinib, Dasatinib, Sorafenib',
                    'Updated alterations for KIT – Thymic cancer – Sunitinib, Sorafenib'
                ],
                'Level 3': [
                    'BRAF V600 – Colorectal Cancer - Encorafenib + Binimetinib + Cetuximab (<b>new association</b>)',
                    'FGFR1 – Amplification – Lung Squamous Cell Carcinoma – AZD4547, Debio1347 (<b>new abstract added</b>)',
                    'FGFR2 - Fusions – Cholangiocarcinoma – BGJ398, Debio1347 (<b>new abstract added</b>)',
                    'Updated alterations for FGFR3 – Bladder cancer - JNJ-42756493, Debio1347',
                    'PIK3CA – Oncogenic mutations – Breast cancer – Updated treatments and evidence'
                ],
                'Level 4': [
                    'BRAF V600 – Colorectal Cancer - Radiation + Trametinib + Fluorouracil (<b>new association</b>)',
                    'Updated alterations for FGFR3 – Breast cancer - Debio1347',
                    'KRAS – Wildtype – Updated treatments and evidence',
                    'KRAS – Oncogenic mtuations - Updated treatments and evidence',
                    'PIK3CA – Oncogenic mutations – Breast cancer – Updated treatments and evidence',
                    'PTEN – Oncogenic mutations – Breast cancer – Updated treatments and evidence'
                ]
            },
            '02022018': {
                'Level 1': [
                    'November 6, 2017: <a target="_blank" ' +
                    'href="https://www.fda.gov/NewsEvents/Newsroom/PressAnnouncements/ucm583931.htm">' +
                    'the FDA approved vemurafenib</a> for treatment of patients with Erdheim-Chester disease (histiocytosis) who harbor BRAF V600 mutations.'
                ],
                'Level 3': [
                    'HRAS - Oncogenic mutations - Head and Neck Squamous Cell Carcinoma - Tipifarnib (<b>moved from Level 4 to 3A only for HNSCC</b>)'
                ]
            },
            '07122018': {
                'Level 1': [
                    'April 18, 2018: <a target="_blank" ' +
                    'href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm605113.htm">' +
                    'the FDA approved osimertinib</a> for the first-line treatment of patients with metastatic non-small cell lung cancer (NSCLC) whose tumors have epidermal growth factor receptor (EGFR) exon 19 deletions or exon 21 L858R mutations.',
                    'May 4, 2018: <a target="_blank" ' +
                    'href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm606708.htm">' +
                    'the FDA approved the combination of dabrafenib plus trametinib</a> for treatment of patients with locally advanced or metastatic anaplastic thyroid cancer with BRAF V600E mutation and with no satisfactory locoregional treatment options.',
                    'June 27, 2018: <a target="_blank" ' +
                    'href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm611981.htm">' +
                    'the FDA approved the combination of encorafenib plus binimetinib</a> for patients with BRAF V600E- or V600K-mutant metastatic and/or unresectable melanoma.',

                ],
                'Level 3': [
                    'EGFR - Exon 20 insertions - Non-small cell lung cancer - Poziotinib (<b>added as new association</b>)',
                    'ALK - G1202R - Non-small cell lung cancer - Lorlatinib (<b>added as new association</b>)',
                    'KIT - D816 mutations - Mastocytosis - Avapritinib (<b>added as new association</b>)',
                    'MTOR - E2014K, E2419K - Bladder cancer - Everolimus (<b>updated association</b>)',
                    'MTOR - L1460P, L2209V, L2427Q - Renal cell carcinoma - Temsirolimus (<b>updated association</b>)',
                    'MTOR - Q2223K - Renal cell carcinoma - Everolimus (<b>updated association</b>)'
                ]
            },
            '08172018': {
                'Level 1': [
                    'July 20, 2018: <a target="_blank" ' +
                    'href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm614128.htm">' +
                    'the FDA approved ivosidenib</a> for adult patients with relapsed or refractory acute myeloid leukemia (AML) with a susceptible IDH1 mutation as detected by an FDA-approved test.',
                ]
            },
            '10012018': {
                'Level 3': [
                    'RET - Oncogenic Mutations - Medullary Thyroid Cancer - LOXO-292 (<b>added as new association</b>)',
                ]
            },
            '10262018': {
                'Level 1': [
                    'Sept 27, 2018: <a target="_blank" ' +
                    'href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm621967.htm">' +
                    'the FDA approved dacomitinib</a> for the frontline treatment of patients with metastatic non-small cell lung cancer with EGFR exon 19 deletion or exon 21 L858R substitution mutations.'
                ]
            }
        };
        $scope.data.newlyAddedLevelFour = [
            {
                'gene': 'ATM',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'Prostate Cancer',
                'drug': 'Olaparib'
            },
            {
                'gene': 'BRAF',
                'mutation': 'D287H, D594A, D594G, D594H, D594N, F595L, G464E, G464V, G466A, G466E, G466V, G469A, G469E, G469R, G469V, G596D, G596R, K601N, K601T, L597Q, L597V, N581I, N581S, S467L, V459L',
                'tumorType': 'All Tumors',
                'drug': 'PLX8394'
            },
            {
                'gene': 'CDKN2A',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'Abemaciclib, Palbociclib, Ribociclib'
            },
            {
                'gene': 'EGFR',
                'mutation': 'A289V, R108K, T263P',
                'tumorType': 'Glioma',
                'drug': 'Lapatinib'
            },
            {
                'gene': 'EGFR',
                'mutation': 'Amplification',
                'tumorType': 'Glioma',
                'drug': 'Lapatinib'
            },
            {
                'gene': 'EWSR1',
                'mutation': 'EWSR1-FLI1 Fusion',
                'tumorType': 'Ewing Sarcoma',
                'drug': 'TK216'
            },
            {
                'gene': 'FGFR1',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'AZD4547, BGJ398, Debio1347, Erdafitinib'
            },
            {
                'gene': 'FGFR2',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'AZD4547, BGJ398, Debio1347, Erdafitinib'
            },
            {
                'gene': 'KRAS',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'KO-947, LY3214996, Ravoxertinib, Ulixertinib'
            },
            {
                'gene': 'MTOR',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'Everolimus, Temsirolimus'
            },
            {
                'gene': 'NF1',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'Cobimetinib, Trametinib'
            },
            {
                'gene': 'PTEN',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'AZD8186, GSK2636771'
            },
            {
                'gene': 'SMARCB1',
                'mutation': 'Oncogenic Mutations',
                'tumorType': 'All Tumors',
                'drug': 'Tazemetostat'
            }
        ];
        $scope.data.newlyAddedGenes = {
            '08172018': ['ACTG1', 'ARHGEF28', 'ARID3A', 'ARID3B', 'ARID3C', 'ARID4A', 'ARID4B', 'ARID5A', 'ATP6AP1', 'ATP6V1B2', 'ATXN2', 'BACH2', 'BCL11B', 'BCORL1', 'BCR', 'BTG1', 'CD28', 'CD58', 'CIITA', 'CRBN', 'CUX1', 'DDX3X', 'DTX1', 'DUSP22', 'EGR1', 'EP400', 'ESCO2', 'ETNK1', 'FANCD2', 'FAS', 'FBXO11', 'FURIN', 'GNA12', 'GNA13', 'GNB1', 'GTF2I', 'HDAC1', 'HDAC4', 'HDAC7', 'HIF1A', 'HIST1H1B', 'HIST1H1D'],
            '10012018': ['HIST1H1E','SETD6','SETD5','SETD7','SETDB2','SETDB1','SETD4','SETD3','SETD1B','U2AF2','TET3','NFE2','IRF8','IRF1','IKZF3','JARID2','NCSTN','HIST1H2BO','HIST1H2AC','HIST1H2BG','HIST1H2BJ','HIST1H2BK','HIST1H2BC','HIST1H2AG','HIST1H2AL','HIST1H2AM','TYK2'],
            '10262018': ['P2RY8','NT5C2','TRAF5','TRAF3','PTPN2','PTPN1','STAG1','PDS5B','PCBP1'],
        };
    });
