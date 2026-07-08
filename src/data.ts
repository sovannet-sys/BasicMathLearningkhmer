/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumberData, Achievement } from './types';

export const KHMER_NUMBERS: NumberData[] = [
  {
    value: 0,
    khmerSymbol: '០',
    arabicSymbol: '0',
    khmerWord: 'សូន្យ',
    pronunciationGuide: 'សូន្យ',
    itemName: 'បាល់ទទេ',
    itemIcon: 'circle-off',
    color: 'bg-rose-50',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-600'
  },
  {
    value: 1,
    khmerSymbol: '១',
    arabicSymbol: '1',
    khmerWord: 'មួយ',
    pronunciationGuide: 'មួយ',
    itemName: 'ផ្លែប៉ោម',
    itemIcon: 'apple',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-600'
  },
  {
    value: 2,
    khmerSymbol: '២',
    arabicSymbol: '2',
    khmerWord: 'ពីរ',
    pronunciationGuide: 'ពីរ',
    itemName: 'មេអំបៅ',
    itemIcon: 'butterfly',
    color: 'bg-sky-50',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-600'
  },
  {
    value: 3,
    khmerSymbol: '៣',
    arabicSymbol: '3',
    khmerWord: 'បី',
    pronunciationGuide: 'បី',
    itemName: 'ផ្កាយ',
    itemIcon: 'star',
    color: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-600'
  },
  {
    value: 4,
    khmerSymbol: '៤',
    arabicSymbol: '4',
    khmerWord: 'បួន',
    pronunciationGuide: 'បួន',
    itemName: 'ប៉េងប៉ោង',
    itemIcon: 'balloon',
    color: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-600'
  },
  {
    value: 5,
    khmerSymbol: '៥',
    arabicSymbol: '5',
    khmerWord: 'ប្រាំ',
    pronunciationGuide: 'ប្រាំ',
    itemName: 'ផ្កាស្អាត',
    itemIcon: 'flower',
    color: 'bg-pink-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-600'
  },
  {
    value: 6,
    khmerSymbol: '៦',
    arabicSymbol: '6',
    khmerWord: 'ប្រាំមួយ',
    pronunciationGuide: 'ប្រាំ-មួយ',
    itemName: 'កូនត្រី',
    itemIcon: 'fish',
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-600'
  },
  {
    value: 7,
    khmerSymbol: '៧',
    arabicSymbol: '7',
    khmerWord: 'ប្រាំពីរ',
    pronunciationGuide: 'ប្រាំ-ពីរ',
    itemName: 'សន្លឹកឈើ',
    itemIcon: 'leaf',
    color: 'bg-lime-50',
    borderColor: 'border-lime-300',
    textColor: 'text-lime-600'
  },
  {
    value: 8,
    khmerSymbol: '៨',
    arabicSymbol: '8',
    khmerWord: 'ប្រាំបី',
    pronunciationGuide: 'ប្រាំ-បី',
    itemName: 'ស្ករគ្រាប់',
    itemIcon: 'candy',
    color: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-600'
  },
  {
    value: 9,
    khmerSymbol: '៩',
    arabicSymbol: '9',
    khmerWord: 'ប្រាំបួន',
    pronunciationGuide: 'ប្រាំ-បួន',
    itemName: 'កូនឆ្មា',
    itemIcon: 'cat',
    color: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-600'
  },
  {
    value: 10,
    khmerSymbol: '១០',
    arabicSymbol: '10',
    khmerWord: 'ដប់',
    pronunciationGuide: 'ដប់',
    itemName: 'ខ្មៅដៃ',
    itemIcon: 'pencil',
    color: 'bg-teal-50',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-600'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'star_collector_1',
    title: 'អ្នកប្រមូលផ្កាយដំបូង',
    description: 'ទទួលបានផ្កាយ ១០ ដំបូង',
    iconName: 'sparkles',
    targetCount: 10,
    type: 'stars',
    rewardStar: 2
  },
  {
    id: 'star_collector_2',
    title: 'កំពូលអ្នកប្រមូលផ្កាយ',
    description: 'ទទួលបានផ្កាយ ៥០',
    iconName: 'award',
    targetCount: 50,
    type: 'stars',
    rewardStar: 5
  },
  {
    id: 'flashcard_explorer',
    title: 'អ្នករុករកលេខ',
    description: 'រៀនកាតលេខ ០ ដល់ ១០ បានគ្រប់ចំនួន',
    iconName: 'grid',
    targetCount: 11,
    type: 'flashcards',
    rewardStar: 3
  },
  {
    id: 'count_master',
    title: 'កំពូលអ្នករាប់លេខ',
    description: 'ហាត់រាប់រូបភាពបាន ១១ លេខ',
    iconName: 'check',
    targetCount: 11,
    type: 'counting',
    rewardStar: 3
  },
  {
    id: 'trace_master',
    title: 'កំពូលអ្នកសរសេរ',
    description: 'ហាត់សរសេរលេខខ្មែរគ្រប់លេខ ០ ដល់ ១០',
    iconName: 'pencil',
    targetCount: 11,
    type: 'tracing',
    rewardStar: 4
  },
  {
    id: 'quiz_expert',
    title: 'កំពូលអ្នកឆ្លាតវៃ',
    description: 'ទទួលបានពិន្ទុក្នុងលំហាត់អនុវត្តយ៉ាងតិច ៨ ផ្កាយ',
    iconName: 'trophy',
    targetCount: 8,
    type: 'quiz',
    rewardStar: 5
  }
];

export const ENCOURAGING_PHRASES = [
  'ល្អណាស់កូន! ព្យាយាមបន្តទៀត!',
  'អស្ចារ្យមែន! កូនឆ្លាតណាស់!',
  'ត្រឹមត្រូវហើយ! ឆ្លាតខ្លាំងណាស់!',
  'កូនពូកែណាស់! ធ្វើបានល្អណាស់!',
  'ស្អាតណាស់! ព្យាយាមប្រឹងប្រែងបន្តទៀត!',
  'អបអរសាទរ! កូនធ្វើបានល្អបំផុត!'
];

export const TRY_AGAIN_PHRASES = [
  'មិនអីទេកូន! សាកល្បងម្តងទៀតណា!',
  'ខិតខំបន្តទៀតកូន! ជិតត្រូវហើយ!',
  'សាកល្បងម្តងទៀត! កូនអាចធ្វើបាន!',
  'ខំប្រឹងបន្តិចទៀតកូន! លើកក្រោយច្បាស់ជាត្រូវ!'
];
