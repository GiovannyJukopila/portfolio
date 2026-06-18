import { Component, Input, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface TimelineEvent {
  date: string;
  title: string;
  company?: string;
  location?: string;
  description: string;
  tags?: string[];
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline">
      <div class="event" *ngFor="let event of events" #timelineItem>
        <span class="node"></span>
        <div class="date">{{ event.date }}</div>
        <div class="content">
          <h3>{{ event.title }}</h3>
          <div class="meta" *ngIf="event.company || event.location">
            <span class="company" *ngIf="event.company"><i class="ph-fill ph-buildings"></i> {{ event.company }}</span>
            <span class="location" *ngIf="event.location"><i class="ph ph-map-pin"></i> {{ event.location }}</span>
          </div>
          <p>{{ event.description }}</p>
          <div class="tags" *ngIf="event.tags?.length">
            <span *ngFor="let t of event.tags">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'mixins' as *;

    .timeline {
      position: relative;
      padding-left: 2.25rem;

      &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 6px;
        bottom: 6px;
        width: 2px;
        background: linear-gradient(180deg, var(--color-primary), rgba(6, 251, 169, 0.05));
      }

      .event {
        position: relative;
        margin-bottom: 2.5rem;
        opacity: 0;
        transform: translateX(20px);

        &:last-child { margin-bottom: 0; }

        .node {
          position: absolute;
          left: -2.25rem;
          top: 0.35rem;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(6, 251, 169, 0.15), 0 0 12px var(--color-primary);
        }

        .date {
          font-family: 'Roboto Mono', monospace;
          color: var(--color-primary);
          font-size: 0.82rem;
          letter-spacing: 0.03em;
          margin-bottom: 0.4rem;
        }

        .content {
          h3 { font-size: 1.15rem; color: #fff; margin-bottom: 0.35rem; }

          .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 0.6rem;
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.55);

            span { display: inline-flex; align-items: center; gap: 0.35rem; }
            .company { color: rgba(255, 255, 255, 0.8); }
            i { color: var(--color-primary); }
          }

          p { color: rgba(255, 255, 255, 0.6); font-size: 0.93rem; line-height: 1.6; margin-bottom: 0.75rem; }

          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;

            span {
              font-size: 0.72rem;
              font-weight: 500;
              padding: 0.2rem 0.6rem;
              border-radius: 6px;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.08);
              color: rgba(255, 255, 255, 0.75);
            }
          }
        }
      }
    }
  `]
})
export class TimelineComponent implements AfterViewInit {
  @Input() events: TimelineEvent[] = [];
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef>;

  ngAfterViewInit() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.timelineItems.forEach(item => {
        item.nativeElement.style.opacity = '1';
        item.nativeElement.style.transform = 'none';
      });
      return;
    }
    this.timelineItems.forEach((item, index) => {
      gsap.to(item.nativeElement, {
        scrollTrigger: { trigger: item.nativeElement, start: 'top 90%', toggleActions: 'play none none reverse' },
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: index * 0.1
      });
    });
  }
}
